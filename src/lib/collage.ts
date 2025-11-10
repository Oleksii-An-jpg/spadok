import sharp from 'sharp';
import { Item } from '@/models/item';

interface Category {
    id: string;
    name: string;
    items: Item[];
}

interface CollageLayout {
    x: number;
    y: number;
    width: number;
    height: number;
}

// Define layouts for different numbers of images
const LAYOUTS: Record<number, CollageLayout[]> = {
    1: [
        { x: 0, y: 0, width: 800, height: 800 }
    ],
    2: [
        { x: 0, y: 0, width: 400, height: 800 },
        { x: 400, y: 0, width: 400, height: 800 }
    ],
    3: [
        { x: 0, y: 0, width: 800, height: 400 },
        { x: 0, y: 400, width: 400, height: 400 },
        { x: 400, y: 400, width: 400, height: 400 }
    ],
    4: [
        { x: 0, y: 0, width: 400, height: 400 },
        { x: 400, y: 0, width: 400, height: 400 },
        { x: 0, y: 400, width: 400, height: 400 },
        { x: 400, y: 400, width: 400, height: 400 }
    ]
};

async function generateCleanCollage(
    images: Buffer[],
    options: { size?: number } = {}
): Promise<Buffer> {
    const size = options.size || 800;
    const bgColor = { r: 245, g: 245, b: 240, alpha: 1 };
    const num = images.length;

    const cols = num <= 2 ? num : 2;
    const rows = Math.ceil(num / cols);
    const gutter = 25;

    const cellW = Math.floor((size - gutter * (cols + 1)) / cols);
    const cellH = Math.floor((size - gutter * (rows + 1)) / rows);

    const composites: sharp.OverlayOptions[] = [];

    for (let i = 0; i < num; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const left = gutter + col * (cellW + gutter);
        const top = gutter + row * (cellH + gutter);

        const fitted = await sharp(images[i])
            .resize(cellW, cellH, {
                fit: "contain", // <- key: never crop
                background: bgColor, // fill extra space to match the collage tone
            })
            .toBuffer();

        composites.push({
            input: fitted,
            left,
            top,
        });
    }

    return sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background: bgColor,
        },
    })
        .composite(composites)
        .jpeg({ quality: 94 })
        .toBuffer();
}

async function downloadImage(url: string): Promise<Buffer> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${url}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

async function prepareImage(
    imageBuffer: Buffer,
    width: number,
    height: number
): Promise<Buffer> {
    return sharp(imageBuffer)
        .resize(width, height, {
            fit: 'cover',
            position: 'center'
        })
        .toBuffer();
}

function selectItemsForCollage(
    items: Item[],
    count: number = 4
): string[] {
    const imageUrls: string[] = [];

    for (const item of items) {
        if (imageUrls.length >= count) break;
        if (item.images && item.images.length > 0) {
            imageUrls.push(`https://storage.googleapis.com/spadok-images/${item.images[0]}`); // Take first image from item
        }
    }

    return imageUrls;
}

async function applyVintageStyle(imageBuffer: Buffer): Promise<Buffer> {
    console.log('Applying vintage style...');

    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 800;

    const vignetteSvg = `
    <svg width="${width}" height="${height}">
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="65%">
          <stop offset="0%" style="stop-color:black;stop-opacity:0" />
          <stop offset="100%" style="stop-color:black;stop-opacity:0.25" />
        </radialGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#vignette)" />
    </svg>
  `;

    const styledImage = await sharp(imageBuffer)
        .modulate({
            brightness: 0.97,
            saturation: 0.80,
        })
        .tint({ r: 255, g: 248, b: 235 })
        .composite([{
            input: Buffer.from(vignetteSvg),
            blend: 'multiply'
        }])
        .jpeg({ quality: 88 })
        .toBuffer();

    console.log('✓ Vintage style applied');
    return styledImage;
}

/**
 * Apply AI style enhancement to match Instagram aesthetic
 */
async function applyAIStyleTransfer(
    imageBuffer: Buffer,
    options: {
        strength?: number;
    } = {}
): Promise<Buffer> {
    const Replicate = (await import('replicate')).default;
    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });

    // Convert buffer to base64 data URL
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

    const strength = options.strength || 0.35; // Low strength to preserve items

    console.log('Applying AI style enhancement...');

    // Using SDXL which is free on Replicate
    const output = await replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
            input: {
                image: base64Image,
                prompt: "vintage Ukrainian heritage museum catalog, warm sepia tones, cultural artifacts, professional photography, earthy colors, historical documentation, traditional crafts, nostalgic aesthetic, high quality",
                negative_prompt: "modern, digital, neon, vibrant, oversaturated, cartoon, anime, low quality, blurry",
                num_inference_steps: 25,
                guidance_scale: 7.5,
                strength: strength,
            }
        }
    ) as string[];

    // Download the enhanced image
    const enhancedImageUrl = output[0];
    const response = await fetch(enhancedImageUrl);
    const arrayBuffer = await response.arrayBuffer();

    console.log('✓ AI enhancement applied');

    return Buffer.from(arrayBuffer);
}

export async function generateCategoryHighlight(
    category: Category,
    options: {
        size?: number;
        maxImages?: number;
        applyAI?: boolean;
        aiStrength?: number;
        applyVintage?: boolean;
    } = {}
): Promise<Buffer> {
    const size = options.size || 800;
    const maxImages = options.maxImages || 4;

    const imageUrls = selectItemsForCollage(category.items, maxImages);

    if (imageUrls.length === 0) {
        throw new Error(`No images found in category "${category.name}"`);
    }

    const numImages = Math.min(imageUrls.length, maxImages);
    const layout = LAYOUTS[numImages];

    if (!layout) {
        throw new Error(`Unsupported number of images: ${numImages}`);
    }

    console.log(`Generating collage for "${category.name}" with ${numImages} images`);

    const imageBuffers = await Promise.all(
        imageUrls.map(url => downloadImage(url))
    );

    const processedImages = await Promise.all(
        imageBuffers.map((buffer, index) =>
            prepareImage(buffer, layout[index].width, layout[index].height)
        )
    );

    const collage = await generateCleanCollage(processedImages, { size });

    console.log(`✓ Base collage generated for "${category.name}"`);

    if (options.applyVintage) {
        return await applyVintageStyle(collage);
    }

    if (options.applyAI) {
        return await applyAIStyleTransfer(collage, {
            strength: options.aiStrength
        });
    }

    return collage;
}
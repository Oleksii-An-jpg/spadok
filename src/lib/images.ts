export const BUCKET_URL = 'https://storage.googleapis.com/spadok-images';

/**
 * Resolves a stored image reference to a displayable url.
 * Legacy references are absolute urls or paths inside /public,
 * everything uploaded through the admin lives in the bucket.
 */
export function getImageUrl(path?: string) {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/')) return path;

    return `${BUCKET_URL}/${encodeURIComponent(path)}`;
}

import {useFileUploadContext} from "@ark-ui/react";
import {Box, FileUpload, Float, HStack, Icon, IconButton, VStack} from "@chakra-ui/react";
import {BiUpload, BiX, BiChevronLeft, BiChevronRight} from "react-icons/bi";
import {FC} from "react";

type FileUploadListItemProps = {
    file: File;
    onMoveLeft: () => void;
    onMoveRight: () => void;
    index: number;
    totalCount: number;
}

const FileUploadListItem: FC<FileUploadListItemProps> = ({ file, onMoveLeft, onMoveRight, index, totalCount }) => {
    const isFirst = index === 0;
    const isLast = index === totalCount - 1;
    return <FileUpload.Item
        w="auto"
        boxSize="20"
        py="2"
        file={file}
        key={file.name}
        className="relative"
    >
        <IconButton
            size="2xs"
            variant="ghost"
            className="!absolute top-1/2 left-0 -translate-y-1/2"
            aria-label="Move left"
            onClick={(e) => {
                e.stopPropagation();
                onMoveLeft();
            }}
            disabled={isFirst}
        >
            <BiChevronLeft />
        </IconButton>
        <Box className="flex w-full h-full justify-center">
            <FileUpload.ItemPreviewImage h="100%" />
        </Box>
        <IconButton
            size="2xs"
            variant="ghost"
            className="!absolute top-1/2 right-0 -translate-y-1/2"
            aria-label="Move right"
            onClick={(e) => {
                e.stopPropagation();
                onMoveRight();
            }}
            disabled={isLast}
        >
            <BiChevronRight />
        </IconButton>
        <Float placement="top-end">
            <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                <BiX />
            </FileUpload.ItemDeleteTrigger>
        </Float>
    </FileUpload.Item>
}

type FileUploadListProps = {
    onReorder?: (fromIndex: number, toIndex: number) => void;
}

const FileUploadList: FC<FileUploadListProps> = ({ onReorder }) => {
    const fileUpload = useFileUploadContext()
    const files = fileUpload.acceptedFiles
    if (files.length === 0) return null
    return (
        <FileUpload.ItemGroup>
            <HStack gap={4} flexWrap="wrap">
                {files.map((file, index) => (
                    <FileUploadListItem file={file} key={file.name} index={index}
                                        totalCount={files.length}
                                        onMoveLeft={() => {
                                            if (index > 0) {
                                                onReorder?.(index, index - 1);
                                            }
                                        }}
                                        onMoveRight={() => {
                                            if (index < files.length - 1) {
                                                onReorder?.(index, index + 1);
                                            }
                                        }} />
                ))}
            </HStack>
        </FileUpload.ItemGroup>
    )
}

const FileUploadPreview: FC = () => {
    const fileUpload = useFileUploadContext()
    const files = fileUpload.acceptedFiles
    if (!files.length) return null
    const [file] = files
    return <FileUpload.ItemGroup>
        <FileUpload.Item
            w="auto"
            h={200}
            p="2"
            file={file}
            key={file.name}
        >
            <Box className="flex w-full h-full justify-center">
                <FileUpload.ItemPreviewImage h="100%" />
            </Box>
        </FileUpload.Item>
    </FileUpload.ItemGroup>
}

type GalleryProps = {
    multiple?: boolean;
    onReorder?: (fromIndex: number, toIndex: number) => void;
}

const Gallery: FC<GalleryProps> = ({ multiple, onReorder }) => {
    return (
        <VStack alignItems="stretch" w="full">
            {multiple ? <FileUploadList onReorder={onReorder} /> : <FileUploadPreview />}
            <FileUpload.Dropzone minH={20} borderStyle="dashed" justifyContent="center" alignItems="center">
                <Icon size="md" color="fg.muted">
                    <BiUpload />
                </Icon>
                <FileUpload.DropzoneContent>
                    Upload
                </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>
        </VStack>
    )
}

export default Gallery
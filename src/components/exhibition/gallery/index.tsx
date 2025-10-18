import {useFileUploadContext} from "@ark-ui/react";
import {FileUpload, Float, HStack, Icon, VStack} from "@chakra-ui/react";
import {BiUpload, BiX} from "react-icons/bi";
import {FC} from "react";
import Link from "next/link";

const FileUploadList: FC = () => {
    const fileUpload = useFileUploadContext()
    const files = fileUpload.acceptedFiles
    if (files.length === 0) return null
    return (
        <FileUpload.ItemGroup>
            <HStack gap={4} flexWrap="wrap">
                {files.map((file) => (
                    <FileUpload.Item
                        w="auto"
                        boxSize="20"
                        p="2"
                        file={file}
                        key={file.name}
                    >
                        <Link className="flex w-full h-full justify-center" prefetch={false} target="_blank" href={`https://storage.googleapis.com/spadok-images/${file.name}`}>
                            <FileUpload.ItemPreviewImage h="100%" />
                        </Link>
                        <Float placement="top-end">
                            <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                                <BiX />
                            </FileUpload.ItemDeleteTrigger>
                        </Float>
                    </FileUpload.Item>
                ))}
            </HStack>
        </FileUpload.ItemGroup>
    )
}

const Gallery: FC = () => {
    return (
        <VStack alignItems="stretch" w="full">
            <FileUploadList />
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
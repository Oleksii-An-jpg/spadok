'use client';
import {FC} from "react";
import {
    Accordion,
    HStack,
    Icon,
    Text,
    useAccordionItemContext,
    Link as ChakraLink,
    VStack
} from "@chakra-ui/react";
import {BiMinus, BiPlus} from "react-icons/bi";
import Avatar from "@/components/avatar";
import Link from "next/link";

type Member = {
    name: string;
    role: string;
    description: string;
    photo: string;
    instagram: string;
}

type TeamMemberProps = {
    members: Member[]
};

const AccordionItemIcon = () => {
    const { expanded } = useAccordionItemContext();

    return <Icon size="lg">
        {expanded ? <BiMinus /> : <BiPlus />}
    </Icon>
}

const Members: FC<TeamMemberProps> = ({ members }) => {
    return <Accordion.Root multiple size="lg">
        {members.map((member, index) => (
            <Accordion.Item css={{ borderBottomWidth: 2 }} key={index} value={member.name}>
                <Accordion.ItemTrigger className="cursor-pointer">
                    <HStack justify="space-between" w="full">
                        <Text fontSize="lg" fontWeight="extralight" lg={{ fontSize: '2xl' }}>{member.name}</Text>
                        <Text className="w-24 xl:w-80 leading-4 xl:leading-6" fontSize="xs" fontWeight="extralight" lg={{ fontSize: 'medium' }}>{member.role}</Text>
                    </HStack>
                    <AccordionItemIcon />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                    <Accordion.ItemBody>
                        <HStack align="start" gap={8}>
                            <Avatar src={member.photo} decorated alt={member.name} />
                            <VStack justify="space-between" align="stretch">
                                <Text fontSize="medium" mb={4} xl={{ mb: 10 }}>
                                    {member.description}
                                </Text>
                                <ChakraLink asChild variant="underline" className="text-xs">
                                    <Link prefetch={false} href={member.instagram} target="_blank">
                                        INSTAGRAM
                                    </Link>
                                </ChakraLink>
                            </VStack>
                        </HStack>
                    </Accordion.ItemBody>
                </Accordion.ItemContent>
            </Accordion.Item>
        ))}
    </Accordion.Root>;
}

export default Members;

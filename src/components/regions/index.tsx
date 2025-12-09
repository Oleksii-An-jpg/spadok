'use client';

import {FC} from "react";
import Entities from "@/components/entities";
import {Region} from "@/models/region";
import {Item} from "@/models/item";
import {Icon} from "@chakra-ui/react";
import {BiHappy, BiSad} from "react-icons/bi";

type RegionsProps = {
    regions: Region[];
    items: Item[]
}

const Regions: FC<RegionsProps> = ({ regions, items }) => {
    return <Entities items={regions.map(region => ({
        ...region,
        count: items.filter(item => item.region.includes(region.id) || item.subRegions?.includes(region.id)).length
    }))} columns={[
        {
            accessorKey: 'isCollection',
            header: 'Підбірка',
            enableColumnFilter: true,
            invertSorting: true,
            cell: info => <Icon color={info.getValue() ? 'green' : 'red'}>
                {info.getValue() ? <BiHappy /> : <BiSad />}
            </Icon>,
            sortingFn: (rowA, rowB) => {
                const valueA = rowA.original.isCollection;
                const valueB = rowB.original.isCollection;

                if (valueA === valueB) return 0; // Values are the same
                if (valueA === false) return 1; // True comes before false (ascending)
                return -1; // False comes after true (ascending)
            }, // Assign the custom sortType,
            meta: {
                filterVariant: 'select'
            }
        },
        {
            accessorFn: (row) => Boolean(row.canFilter),
            header: 'У фільтрах',
            enableColumnFilter: true,
            invertSorting: true,
            cell: info => <Icon color={info.getValue() ? 'green' : 'red'}>
                {info.getValue() ? <BiHappy /> : <BiSad />}
            </Icon>,
            sortingFn: (rowA, rowB) => {
                const valueA = rowA.original.isCollection;
                const valueB = rowB.original.isCollection;

                if (valueA === valueB) return 0; // Values are the same
                if (valueA === false) return 1; // True comes before false (ascending)
                return -1; // False comes after true (ascending)
            }, // Assign the custom sortType,
            meta: {
                filterVariant: 'select'
            }
        },
    ]} />
}

export default Regions
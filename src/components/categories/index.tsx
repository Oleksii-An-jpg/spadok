'use client';

import {FC} from "react";
import Entities from "@/components/entities";
import {Category} from "@/models/category";
import {Item} from "@/models/item";
import {Icon} from "@chakra-ui/react";
import {BiHappy, BiSad} from "react-icons/bi";

type CategoriesProps = {
    categories: Category[];
    items: Item[]
}

const Categories: FC<CategoriesProps> = ({ categories, items }) => {
    return <Entities items={categories.map(category => ({
        ...category,
        count: items.filter(item => item.mainCategory === category.id || item.subCategories?.includes(category.id)).length
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
            accessorKey: 'isHomepage',
            header: 'На головній',
            enableColumnFilter: true,
            invertSorting: true,
            cell: info => {
                const isCollection = info.row.original.isCollection;

                if (isCollection) {
                    return <Icon color={info.getValue() ? 'green' : 'red'}>
                        {info.getValue() ? <BiHappy /> : <BiSad />}
                    </Icon>
                }

                return null;
            },
            sortingFn: (rowA, rowB) => {
                const valueA = rowA.original.isHomepage;
                const valueB = rowB.original.isHomepage;

                if (valueA === valueB) return 0; // Values are the same
                if (valueA === false) return 1; // True comes before false (ascending)
                return -1; // False comes after true (ascending)
            }, // Assign the custom sortType,
            meta: {
                filterVariant: 'select'
            }
        }
    ]} />
}

export default Categories
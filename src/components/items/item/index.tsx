'use client';
import {Item as ItemModel} from "@/models/item";
import {FC} from "react";

type ItemProps = {
    item: ItemModel
}

const Item: FC<ItemProps> = ({ item }) => {
    return (
        <div>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
        </div>
    )
}

export default Item;
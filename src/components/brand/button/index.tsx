import {forwardRef, ForwardRefRenderFunction, useMemo} from "react";
import {ButtonProps, Button} from "@chakra-ui/react";
import clsx from "clsx";

type BrandButtonProps = ButtonProps & {
    decorated?: boolean;
}

const BrandButtonView: ForwardRefRenderFunction<HTMLButtonElement, BrandButtonProps> = ({ decorated, children, ...rest }, ref) => {
    const decoration = useMemo(() => {
        if (rest.variant === 'brand-secondary') {
            return 'before:bg-salmon after:bg-salmon group-hover:before:bg-travertine group-hover:after:bg-travertine';
        }

        // if (rest.variant === 'brand-tertiary') {
        //     return 'before:bg-travertine after:bg-travertine group-hover:before:bg-azure group-hover:after:bg-azure'
        // }

        return 'before:bg-travertine after:bg-travertine group-hover:before:bg-azure group-hover:after:bg-azure'
    }, [rest.variant])
    return <Button ref={ref} className="group relative transition-all ease-in-out duration-300 font-light" {...rest}>
        {decorated ? <>
            <i className={clsx(
                decoration,
                'before:content-[""] before:absolute before:right-full before:bottom-full before:w-5 before:h-5 before:transition-all before:ease-in-out before:duration-300',
                'after:content-[""] after:absolute after:left-full after:bottom-full after:w-5 after:h-5 after:transition-all after:ease-in-out after:duration-300',
                'group-hover:before:right-[calc(0px-theme(space.5))]',
                'group-hover:after:bottom-[calc(0px-theme(space.5))]'
            )} />
            {children}
            <i className={clsx(
                decoration,
                'before:content-[""] before:absolute before:right-full before:top-full before:w-5 before:h-5 before:transition-all before:ease-in-out before:duration-300',
                'after:content-[""] after:absolute after:left-full after:top-full after:w-5 after:h-5 after:transition-all after:ease-in-out after:duration-300',
                'group-hover:before:top-[calc(0px-theme(space.5))]',
                'group-hover:after:left-[calc(0px-theme(space.5))]'
            )} />
        </> : children}
    </Button>
}

const BrandButton = forwardRef(BrandButtonView);

export default BrandButton;
'use server'

import {adminAuth} from "@/lib/admin";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {ReactNode} from "react";
import {Card, Grid, GridItem} from "@chakra-ui/react";
import Sidebar from "@/components/sidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) redirect("/auth");

    try {
        const decoded = await adminAuth.verifySessionCookie(sessionCookie.value, true);
        if (!decoded.admin) redirect("/403");
    } catch {
        redirect("/auth");
    }

    // await getAuth()
    //         .setCustomUserClaims('CeBoqg5E3OT31G6tkzDWONkZTBv1', { admin: true })
    //         .then(() => {
    //             // The new custom claims will propagate to the user's ID token the
    //             // next time a new one is issued.
    //         });

    return <Grid gridTemplateColumns="200px 1fr" p={4} gap={4}>
        <GridItem>
            <Sidebar />
        </GridItem>
        <GridItem>
            <Card.Root>
                {children}
            </Card.Root>
        </GridItem>
    </Grid>
}
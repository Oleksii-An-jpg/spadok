import {Role} from "@/lib/roles";

export type Account = {
    uid: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    role: Role;
    disabled: boolean;
    lastSignInTime: string | null;
}

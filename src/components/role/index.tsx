'use client';
import {createContext, FC, PropsWithChildren, useContext} from "react";
import {canEdit, canManageAccounts, Role} from "@/lib/roles";

const RoleContext = createContext<Role>('guest');

/**
 * Makes the role resolved server-side available to the admin UI, so read-only
 * users are not shown controls that the API would reject anyway. The server
 * remains the only thing actually enforcing this.
 */
export const RoleProvider: FC<PropsWithChildren<{ role: Role }>> = ({ role, children }) => (
    <RoleContext.Provider value={role}>{children}</RoleContext.Provider>
);

export const useRole = () => useContext(RoleContext);

export const useCanEdit = () => canEdit(useRole());

export const useCanManageAccounts = () => canManageAccounts(useRole());

export default RoleProvider;

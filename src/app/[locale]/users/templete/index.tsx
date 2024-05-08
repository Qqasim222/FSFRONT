"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import UsersSearchForm from "@/components/users/usersList/user-search-form";
import CustomButton from "@/components/common/button/custom-button";
import UserListTable from "@/components/users/usersList/user-list-table";
import UserModal from "@/components/users/usersList/user-modal";
import { toast } from "react-toastify";
import axios from "@/common/util/api/axios-public-client";
import useLoading from "@/common/hook/loading";
import { selectSessionInfo } from "@/store/slices/authSlice";
import { useSelector } from "react-redux";
import AssociateCollectionModal from "@/components/users/usersList/collectionAssociate/associate-collection-modal";
import { USERS } from "@/common/constant/local.constant";
import { GET_COUNTRY_LIST_USERS } from "@/common/constant/local.constant";

const UsersPage = () => {
  const t = useTranslations("usersPage");
  const [isAddUserModalOpen, setAddUserModalOpen] = useState<boolean>(false);
  const [isAssociateCollectionModalOpen, setAssociateCollectionModalOpen] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState(0);
  const sessionInfo = useSelector(selectSessionInfo);
  const [userData, setUserData] = useState([]);
  const { loading, startLoading, stopLoading } = useLoading();
  const [associatedUser, setAssociatedUser] = useState({});
  const [countriesList, setCountriesList] = useState([]);

  // User Permissions
  const superAdminPermissions = sessionInfo?.role?.permissions === "*";
  let canCreateUser = false;
  let canReadUser = false;
  let canUpdateUser = false;
  if (superAdminPermissions) {
    canCreateUser = true;
    canReadUser = true;
    canUpdateUser = true;
  } else {
    const permissions = sessionInfo?.role?.permissions?.User;
    if (permissions) {
      ({
        ["can-create-user"]: canCreateUser,
        ["can-read-user"]: canReadUser,
        ["can-update-user"]: canUpdateUser,
      } = permissions || {});
    }
  }
  // Modal handle
  const handleAddUserModal = () => {
    setAddUserModalOpen(true);
  };
  const handleCloseModal = () => {
    setAddUserModalOpen(false);
    setAssociateCollectionModalOpen(false);
  };

  // HandleAssociateCollectionModal
  const handleAssociateCollectionModal = (id: string, role: string, name: string) => {
    if (role) {
      setAssociateCollectionModalOpen(true);
      setAssociatedUser({ id: id, role: role, name: name });
    }
  };

  // handleUserUpdate
  const handleUserUpdate = async (newPage: number = 1, filters: any) => {
    try {
      startLoading();
      const apiResponse = await axios.get(USERS, {
        params: { page: newPage, pageSize: 10, order: "desc", ...filters },
      });
      if (apiResponse?.data?.statusCode === 200) {
        setUserData(apiResponse?.data?.data?.users);
        setTotalCount(apiResponse?.data?.data?.totalCount);
      } else {
        toast.error(apiResponse?.data?.message);
      }
    } catch (error: Error) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
      stopLoading();
    }
  };
  //fetch countries list
  const fetchCountryData = async () => {
    try {
      const apiResponse = await axios.get(GET_COUNTRY_LIST_USERS);
      if (apiResponse?.data?.statusCode === 200) {
        setCountriesList(apiResponse?.data?.data?.countries);
      } else {
        toast.error(apiResponse?.data?.message);
      }
    } catch (error: any) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
    }
  };
  useEffect(() => {
    fetchCountryData();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl text-th-primary-hard font-bold mb-4">{t("userList")}</h3>
        {canCreateUser && (
          <div className="text-xl text-th-primary-hard mb-4">
            <CustomButton
              className="w-full rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg"
              type="button"
              label={t("addUser")}
              onClick={handleAddUserModal}
            />
            <UserModal
              isOpen={isAddUserModalOpen}
              onCancel={handleCloseModal}
              onUserListUpdate={handleUserUpdate}
              handleAssociateCollectionModal={handleAssociateCollectionModal}
              countriesList={countriesList}
            />
            <AssociateCollectionModal
              isOpen={isAssociateCollectionModalOpen}
              onCancel={handleCloseModal}
              associatedUser={associatedUser}
            />
          </div>
        )}
      </div>
      {canReadUser && (
        <>
          <UsersSearchForm onSearchSubmit={handleUserUpdate} userData={userData} countriesList={countriesList} />
          <UserListTable
            canUpdateUser={canUpdateUser}
            onUserListUpdate={handleUserUpdate}
            userData={userData}
            loading={loading}
            totalCount={totalCount}
            countriesList={countriesList}
          />
        </>
      )}
    </div>
  );
};

export default UsersPage;

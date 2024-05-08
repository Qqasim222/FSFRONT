import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import UserModal from "./user-modal";
import { Loader } from "../../common/placeholder/loader";
import { toast } from "react-toastify";
import AssociateCollectionModal from "./collectionAssociate/associate-collection-modal";
import Pagination from "@/components/common/pagination/pagination";
import NoResultFound from "@/components/common/placeholder/no-result-found";
import { FaPencil } from "react-icons/fa6";

interface UserListTableProps {
  canUpdateUser: boolean;
  onUserListUpdate: () => Promise<void>;
  userData: any[];
  loading: boolean;
  totalCount: number;
  countriesList: any;
}

const UserListTable: React.FC<UserListTableProps> = ({
  canUpdateUser,
  onUserListUpdate,
  userData,
  loading,
  totalCount,
  countriesList,
}) => {
  const t = useTranslations("usersPage");
  const [selectedUserData, setSelectedUserData] = useState("");
  const [isEditUserModalOpen, setEditUserModalOpen] = useState<boolean>(false);
  const [isUpdateMode, setUpdateMode] = useState<boolean>(false);
  const [isAssociateCollectionModalOpen, setAssociateCollectionModalOpen] = useState<boolean>(false);
  const [associatedUser, setAssociatedUser] = useState({});

  // Handle Modal
  const handleEditClick = (data: any) => {
    setSelectedUserData(data);
    setEditUserModalOpen(true);
    setUpdateMode(true);
  };
  const handleCloseModal = () => {
    setEditUserModalOpen(false);
    setAssociateCollectionModalOpen(false);
  };

  // Handle AssociateCollectionModal
  const handleAssociateCollectionModal = (id: string, role: string, name: string) => {
    if (role) {
      setAssociateCollectionModalOpen(true);
      setAssociatedUser({ id: id, role: role, name: name });
    }
  };
  // tableColumns
  const tableColumns = [
    t("tableColumns.firstName"),
    t("tableColumns.lastName"),
    t("tableColumns.e-mail"),
    t("tableColumns.mobile"),
    t("tableColumns.country"),
    t("tableColumns.role"),
    t("tableColumns.update"),
    t("tableColumns.loginDate"),
    t("tableColumns.status"),
    t("tableColumns.action"),
  ];
  // Update data
  useEffect(() => {
    const fetcher = async () => {
      try {
        await onUserListUpdate();
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
      }
    };
    if (!loading) {
      fetcher();
    }
  }, []);

  return (
    <div className="bg-th-background p-2 md:p-4 rounded-xl">
      {loading ? (
        <Loader />
      ) : (
        <>
          {userData?.length > 0 ? (
            <>
              <div className="relative overflow-x-auto rounded-md">
                <table className="w-full text-sm text-left bg-th-primary-medium ">
                  <thead className="text-sm text-th-primary-hard capitalize ">
                    <tr>
                      {tableColumns?.map((column, index) => (
                        <th key={index} scope="col" className="px-3 py-4 whitespace-nowrap">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-th-background border">
                    {userData?.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b font-medium text-th-secondary-medium hover:bg-th-primary-light"
                      >
                        <td className="px-3 py-4 whitespace-nowrap">{item?.firstName || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{item?.lastName || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{item?.email || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{item?.mobile || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{item?.country || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{item?.role?.name || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {new Date(item?.updatedAt).toDateString() || "N/A"}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {new Date(item?.createdAt).toDateString() || "N/A"}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap capitalize">{item?.status || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap flex justify-center">
                          {canUpdateUser ? (
                            <FaPencil
                              className="cursor-pointer text-th-primary-hard hover:text-th-secondary-medium"
                              onClick={() => handleEditClick(item)}
                            />
                          ) : (
                            <FaPencil className="cursor-not-allowed text-th-primary-hard hover:text-th-secondary-medium" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalCount > 10 ? <Pagination count={totalCount} onPaginationChange={onUserListUpdate} /> : <></>}
            </>
          ) : (
            <NoResultFound />
          )}
        </>
      )}
      {/* UserModal component */}
      <UserModal
        isOpen={isEditUserModalOpen}
        onCancel={handleCloseModal}
        isUpdateMode={isUpdateMode}
        countriesList={countriesList}
        selectedUserData={selectedUserData}
        onUserListUpdate={onUserListUpdate}
        handleAssociateCollectionModal={handleAssociateCollectionModal}
      />
      <AssociateCollectionModal
        isOpen={isAssociateCollectionModalOpen}
        onCancel={handleCloseModal}
        associatedUser={associatedUser}
      />
    </div>
  );
};

export default UserListTable;

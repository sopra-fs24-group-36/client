import React, { useEffect, useState } from "react";
import { api } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/GroupMembers.scss";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import BaseContainer from "components/ui/BaseContainer_new";
import Header_new from "components/ui/Header_new";
import { Spinner } from "../ui/Spinner";
import InviteUserModal from "./InviteUserModal";


const GroupMembers = () => {
  const navigate = useNavigate();
  const { groupID } = useParams();
  const [groupInfo, setGroupInfo] = useState<any[]>([]);
  const [memberList, setMemberList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isInviteUserModalOpen, setIsInviteUserModalOpen] = useState(false);

  const fetchGroupInfo = async () => {
    try {
      const response = await api.get(`/groups/${groupID}`);
      setGroupInfo(response.data);
      await fetchMembers(response.data.members);
      setLoading(false);
    } catch (error) {
      alert("Something went wrong while fetching the group");
      setLoading(false);
    }
  };

  const fetchMembers = async (members: number[]) => {
    const updatedMembers = await Promise.all(
      members.map(async (memberID) => {
        try {
          const response = await api.get(`/users/${memberID}`);

          return response.data;
        } catch (error) {
          console.error("Error fetching member:", error);

          return null;
        }
      }),
    );
    setMemberList(updatedMembers.filter((member) => member !== null));
  };


  useEffect(() => {
    fetchGroupInfo();
  }, [groupID]);

  const handelClickMember = (id: number) => {
    navigate(`/users/${id}`);
  };

  const MemberList = ({ memberList, onClickMember }: any) => (
    <table className="groupmembers itemsContainer">
      <thead>
        <tr className="members titleField">
          <td className="members imgContainer"></td>
          <th className="members id">ID</th>
          <th className="members username">Username</th>
          <th className="members name">Name</th>
          <th className="members email">Email</th>
        </tr>
      </thead>
      <tbody>
        {memberList.map((member: any, index: number) => (
          <Button className="members itemsField" key={index} onClick={() => onClickMember(member.id)}>
            <td className="members imgContainer">
              <img className="members img" src={member.profilePicture} alt="member Image" />
            </td>
            <td className="members id">{member.id}</td>
            <td className="members username">{member.username}</td>
            <td className="members name">{member.name}</td>
            <td className="members useremail">{(member.email)}</td>
          </Button>
        ))}
      </tbody>
    </table>
  );


  if (loading) {
    return <Spinner />;
  }

  // @ts-ignore
  return (
    <div>
      <Header_new />
      <Dashboard
        showButtons={{
          home: true,
          cookbook: true,
          recipe: true,
          groupCalendar: true,
          groupShoppinglist: true,
          invitations: true,
          leaveGroup: true,
        }}
        activePage="leaveGroup"
      />
      <BaseContainer>
        <div className="groupmembers headerContainer">
          <div className="groupmembers backButtonContainer">
            <Button className="backButton" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
          <h2 className="groupmembers title">{groupInfo.name} - Members</h2>
          <div className="groupmembers backButtonContainer">
            <Button
              className="backButton"
              onClick={() => setIsInviteUserModalOpen(true)}>
              Invite a User
            </Button>
            <InviteUserModal
              open={isInviteUserModalOpen}
              onClose={() => setIsInviteUserModalOpen(false)}>
            </InviteUserModal>
          </div>
        </div>

        <div className="groupmembers container">
          <MemberList memberList={memberList} onClickMember={handelClickMember} />
        </div>
      </BaseContainer>
      <Footer />
    </div>
  );
};

export default GroupMembers;
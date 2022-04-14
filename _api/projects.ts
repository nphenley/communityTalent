import { firestore } from '_firebase/config';
import {
  addDoc,
  collection,
  Timestamp,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  increment,
  setDoc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import { Project } from '_types/Project';

export const createProject = async (communityId: string, project: Project, setProjects: any) => {
  const docRef = await addDoc(collection(firestore, 'projectUpvotes'), {});

  await setDoc(doc(firestore, 'communities', communityId, 'projects', docRef.id), {
    ...project,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
  await getProjects(communityId, setProjects);
};

export const updateProject = async (
  communityId: string,
  projectId: string,
  data: Partial<Project>,
  setProject: any
) => {
  await updateDoc(doc(firestore, 'communities', communityId, 'projects', projectId), {
    ...data,
    dateLastUpdated: Timestamp.now(),
  });
  getProject(communityId, projectId, setProject);
};

export const getProjects = async (communityId: string, updateProjects: any) => {
  const data = await getDocs(
    query(collection(firestore, 'communities', communityId, 'projects'), orderBy('dateCreated', 'desc'))
  );
  updateProjects(data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Project)));
};

export const getProject = async (communityId: string, projectId: string, setProject: any) => {
  const data = await getDoc(doc(firestore, 'communities', communityId, 'projects', projectId));
  setProject({ ...data.data(), id: data.id } as Project);
};

export const toggleProjectUpvote = async (
  communityId: string,
  projectId: string,
  walletGroupID: string,
  userVoted: boolean,
  setProject: any,
  setUserVote: any
) => {
  if (!userVoted) {
    await Promise.all([
      setDoc(doc(firestore, 'projectUpvotes', projectId, 'upvotes', walletGroupID), {}),
      updateDoc(doc(firestore, 'communities', communityId, 'projects', projectId), {
        votes: increment(1),
      }),
    ]);

    setUserVote(true);
  } else {
    await Promise.all([
      deleteDoc(doc(firestore, 'projectUpvotes', projectId, 'upvotes', walletGroupID)),
      updateDoc(doc(firestore, 'communities', communityId, 'projects', projectId), {
        votes: increment(-1),
      }),
    ]);

    setUserVote(false);
  }
  getProject(communityId, projectId, setProject);
};

export const getUserVote = async (projectId: string, walletGroupID: string, setUserVote: any) => {
  const upvote = await getDoc(doc(firestore, 'projectUpvotes', projectId, 'upvotes', walletGroupID));
  setUserVote(upvote.exists());
};

export const deleteProject = async (communityId: string, projectId: string, setProjects: any) => {
  await Promise.all([
    deleteDoc(doc(firestore, 'communities', communityId, 'projects', projectId)),
    deleteDoc(doc(firestore, 'projectUpvotes', projectId)),
  ]);
  getProjects(communityId, setProjects);
};

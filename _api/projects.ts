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
  where,
} from 'firebase/firestore';
import { Project } from '_types/Project';

// TODO:
// Visit how project upvotes etc are done with this function?
// Bit confused
export const createProject = async (communityId: string, project: Partial<Project>, setProjects: any) => {
  const docRef = await addDoc(collection(firestore, 'communities', communityId, 'projects'), {
    ...project,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });

  await setDoc(doc(firestore, 'communities', communityId, 'projectUpvotes', `${project.walletGroupID}_${docRef.id}`), {
    walletGroupID: project.walletGroupID,
    projectId: docRef.id,
  });

  await getProjects(communityId, setProjects);
};

export const updateProject = async (
  communityId: string,
  projectId: string,
  project: Partial<Project>,
  setProjects: any
) => {
  await updateDoc(doc(firestore, 'communities', communityId, 'projects', projectId), {
    ...project,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });

  await getProjects(communityId, setProjects);
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

// TODO:
// Old
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

// TODO:
// Old
export const getUserVote = async (projectId: string, walletGroupID: string, setUserVote: any) => {
  const upvote = await getDoc(doc(firestore, 'projectUpvotes', projectId, 'upvotes', walletGroupID));
  setUserVote(upvote.exists());
};

export const deleteProject = async (communityId: string, projectId: string, setProjects: any) => {
  await Promise.all([
    deleteDoc(doc(firestore, 'communities', communityId, 'projects', projectId)),
    getDocs(
      query(collection(firestore, 'communities', communityId, 'projectUpvotes'), where('projectId', '==', projectId))
    ).then((querySnap) => {
      return Promise.all(querySnap.docs.map(async (doc) => deleteDoc(doc.ref)));
    }),
  ]);
  getProjects(communityId, setProjects);
};

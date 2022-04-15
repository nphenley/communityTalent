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
export const createProject = async (communityId: string, project: Partial<Project>) => {
  const docRef = await addDoc(collection(firestore, 'communities', communityId, 'projects'), {
    ...project,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });

  await setDoc(doc(firestore, 'communities', communityId, 'projectUpvotes', `${project.walletGroupID}_${docRef.id}`), {
    walletGroupID: project.walletGroupID,
    projectId: docRef.id,
  });
};

export const updateProject = async (communityId: string, projectId: string, project: Partial<Project>) => {
  await updateDoc(doc(firestore, 'communities', communityId, 'projects', projectId), {
    ...project,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

export const getProjects = async (walletGroupID: string, communityId: string, updateProjects: any) => {
  const data = await getDocs(
    query(collection(firestore, 'communities', communityId, 'projects'), orderBy('dateCreated', 'desc'))
  );

  const projects: Project[] = await Promise.all(
    data.docs.map(async (docRef) => {
      const isUpvoted = (
        await getDoc(doc(firestore, 'communities', communityId, 'projectUpvotes', `${walletGroupID}_${docRef.id}`))
      ).exists();

      console.log('getProjects', docRef.id, docRef.data()!.upvotes);

      return { ...docRef.data(), isUpvoted: isUpvoted, id: docRef.id } as Project;
    })
  );

  updateProjects(projects);
};

export const toggleProjectUpvote = async (
  walletGroupID: string,
  communityId: string,
  projectId: string,
  isUpvoted: boolean
) => {
  console.log(projectId);
  if (!isUpvoted) {
    await Promise.all([
      setDoc(doc(firestore, 'communities', communityId, 'projectUpvotes', `${walletGroupID}_${projectId}`), {
        walletGroupID: walletGroupID,
        projectId: projectId,
      }),
      updateDoc(doc(firestore, 'communities', communityId, 'projects', projectId), {
        upvotes: increment(1),
      }),
    ]);
  } else {
    await Promise.all([
      deleteDoc(doc(firestore, 'communities', communityId, 'projectUpvotes', `${walletGroupID}_${projectId}`)),
      updateDoc(doc(firestore, 'communities', communityId, 'projects', projectId), {
        upvotes: increment(-1),
      }),
    ]);
  }
};

export const deleteProject = async (communityId: string, projectId: string) => {
  await Promise.all([
    deleteDoc(doc(firestore, 'communities', communityId, 'projects', projectId)),
    getDocs(
      query(collection(firestore, 'communities', communityId, 'projectUpvotes'), where('projectId', '==', projectId))
    ).then((querySnap) => {
      return Promise.all(querySnap.docs.map(async (doc) => deleteDoc(doc.ref)));
    }),
  ]);
};

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
} from 'firebase/firestore';
import { Project } from '_types/Project';

export const createProject = async (communityId: string, project: Project) => {
  return addDoc(collection(firestore, 'communities', communityId, 'projects'), {
    ...project,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

export const updateProject = async (
  communityId: string,
  projectId: string,
  data: Partial<Project>
) => {
  return updateDoc(
    doc(
      collection(firestore, 'communities', communityId, 'projects'),
      projectId
    ),
    { ...data, dateLastUpdated: Timestamp.now() }
  );
};

export const getProjects = async (communityId: string, setProjects: any) => {
  const data = await getDocs(
    query(
      collection(firestore, 'communities', communityId, 'projects'),
      orderBy('dateCreated', 'desc')
    )
  );
  setProjects(
    data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Project))
  );
};

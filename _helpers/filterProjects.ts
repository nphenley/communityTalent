import { Project } from '_types/Project';

export const filterProjects = (projects: Project[], searchQuery: string) => {
  return projects.filter((project) => {
    const searchWords = searchQuery.toLowerCase().split(' ');
    let accumString =
      project.creatorDisplayName +
      ' ' +
      project.description +
      ' ' +
      project.role +
      ' ' +
      project.languages.join(' ') +
      ' ' +
      project.skills?.join(' ') +
      ' ';
    for (const word of searchWords) if (!accumString.toLowerCase().includes(word)) return false;
    return true;
  });
};

import { Community } from '_types/Community';

export const filterCommunities = (
  communities: Community[],
  searchQuery: string
) => {
  return communities.filter((community) => {
    const searchWords = searchQuery.toLowerCase().split(' ');
    let accumString = community.name;
    for (const word of searchWords)
      if (!accumString.toLowerCase().includes(word)) return false;
    return true;
  });
};

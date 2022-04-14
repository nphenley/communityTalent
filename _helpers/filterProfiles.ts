import { Profile } from '_types/Profile';

export const filterProfiles = (profiles: Profile[], searchQuery: string) => {
  return profiles.filter((profile) => {
    const searchWords = searchQuery.toLowerCase().split(' ');
    let accumString =
      profile.displayName +
      ' ' +
      profile.bio +
      ' ' +
      profile.skills?.join(' ') +
      ' ' +
      profile.tags?.join(' ') +
      ' ' +
      profile.languages?.join(' ') +
      ' ' +
      profile.relevantLinks?.join(' ') +
      ' ';
    accumString += profile.twitterHandle ? profile.twitterHandle + ' ' : ' ';
    accumString += profile.discordUsername ? profile.discordUsername + ' ' : ' ';
    accumString += profile.experience ? profile.experience + ' ' : ' ';
    accumString += profile.lookingForProject === true ? 'looking for project' : '';
    for (const word of searchWords) if (!accumString.toLowerCase().includes(word)) return false;
    return true;
  });
};

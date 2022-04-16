import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '_firebase/config';
import { SelectOption } from '_types/SelectOption';

export const getProfileFormOptions = async (setSelectOptions: any) => {
  const languages = await getDoc(doc(firestore, 'selectOptions', 'languages'));
  const tags = await getDoc(doc(firestore, 'selectOptions', 'tags'));
  const timezones = await getDoc(doc(firestore, 'selectOptions', 'timezones'));

  const languageOptions: SelectOption[] = languages.data()!.array.map((key: string) => {
    return {
      label: key,
      value: key,
    };
  });
  const tagOptions: SelectOption[] = tags.data()!.array.map((key: string) => {
    return {
      label: key,
      value: key,
    };
  });
  const timezoneOptions: SelectOption[] = timezones.data()!.array.map((key: string) => {
    return {
      label: key,
      value: key,
    };
  });
  setSelectOptions({
    languages: languageOptions,
    tags: tagOptions,
    timezones: timezoneOptions,
  });
};

export const getProjectFormOptions = async (setSelectOptions: any) => {
  const languages = await getDoc(doc(firestore, 'selectOptions', 'languages'));

  const languageOptions: SelectOption[] = languages.data()!.array.map((key: string) => {
    return {
      label: key,
      value: key,
    };
  });

  setSelectOptions({
    languages: languageOptions,
  });
};

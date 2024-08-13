export const hasSpecial = (word: string): boolean => {
  let isSpecial = false;
  const specials = "@#$%!&";
  for (let i = 0; i < word.length; i++) {
    if (specials.includes(word[i])) {
      isSpecial = true;
      break;
    }
  }
  return isSpecial;
};

export const getPostDate = (date: Date): string => {
    const currentDate = new Date();
    let timeDifference ;
    timeDifference = (currentDate.getTime() - date.getTime())/(1000 * 60); //in minutes
    if(timeDifference < 60) {
        return `${Math.floor(timeDifference).toString()} mins ago`;
    } else if(timeDifference > 60 && timeDifference < 60 * 24) {
        return `${Math.floor((timeDifference/60)).toString()} hours ago`;
    } else {
        return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
    }
};

export const getDateFromDateString = (dateString:string) => {
  const date = new Date(dateString);
  const month = date.getMonth()+1;
  const day = date.getDate();
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

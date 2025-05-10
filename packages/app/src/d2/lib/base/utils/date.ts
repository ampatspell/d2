export const formatDate = (
  date: Date | undefined,
  dateStyle: Intl.DateTimeFormatOptions['dateStyle'],
  timeStyle: Intl.DateTimeFormatOptions['timeStyle'],
) => {
  if (date) {
    const { locale, timeZone } = Intl.DateTimeFormat().resolvedOptions();
    const format = new Intl.DateTimeFormat(locale, {
      dateStyle,
      timeStyle,
      timeZone,
    });
    return format.format(date);
  }
};

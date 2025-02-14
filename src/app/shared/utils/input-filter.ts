import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

export default function autoCompleteFilter(
  event: AutoCompleteCompleteEvent,
  data: any[],
  propName?: string,
) {
  const query = event.query;
  let filtered: any[] = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const str = propName ? item[propName] : item['name'] || item;

    if (str.toLowerCase().indexOf(query.toLowerCase()) != -1) {
      filtered.push(item);
    }
  }
  return filtered;
}

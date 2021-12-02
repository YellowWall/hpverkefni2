export async function fetchData() {
  let json;
  try {
    const result = await fetch('../data.json');

    if (!result.ok) {
      throw new Error('Result not ok');
    }

    json = await result.json();
  } catch (e) {
    console.warn('Unable to fetch data', e);
    return null;
  }
  return json;
}

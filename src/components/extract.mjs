const url = 'https://quintessencedental.com/best-dental-clinic-in-kammanahalli/';
fetch(url)
  .then(r => r.text())
  .then(t => {
    const match = t.match(/<meta property="og:image" content="([^"]+)"/);
    console.log(match ? match[1] : 'No image found');
  })
  .catch(console.error);

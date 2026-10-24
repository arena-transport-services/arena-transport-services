# Arena Transport Services – website

Static website for [Arena Transport Services](https://arena-transport-services.github.io/arena-transport-services/), a Sydney metropolitan express courier company.
It was migrated from WordPress (Divi theme) to plain HTML/CSS/JS so it can be hosted on GitHub Pages.

**Live site:** <https://arena-transport-services.github.io/arena-transport-services/>

## Structure

```
index.html            One-page site: hero, services, about, clients, contact
404.html              Not-found page (served automatically by GitHub Pages)
assets/css/style.css  All styles (brand colours defined in :root)
assets/js/main.js     Slider, mobile menu, scroll effects, contact form
assets/img/           Logo, hero photos, service icons, client logos
.nojekyll             Tells GitHub Pages to serve files as-is
```

## Run locally

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy to GitHub Pages

The site is deployed from the `main` branch (root folder) of
[arena-transport-services/arena-transport-services](https://github.com/arena-transport-services/arena-transport-services)
and published at <https://arena-transport-services.github.io/arena-transport-services/>.
Every push to `main` goes live within a minute or two.

The Pages settings are under **Settings → Pages**: **Source** is *Deploy from a branch*, `main` / `(root)`.

### Custom domain (arenatransport.com.au)

1. Add a `CNAME` file containing `arenatransport.com.au` (or set the domain under **Settings → Pages**).
2. At the DNS provider, point the apex domain to GitHub Pages with `A` records
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`,
   and add a `CNAME` record for `www` pointing to `arena-transport-services.github.io`.
3. Once DNS has propagated, enable **Enforce HTTPS**.

## Contact form

GitHub Pages can't run server code, so the form opens the visitor's email app with the message pre-filled to `info@arenatransport.com.au`.
To receive submissions directly, point the form at a form service such as Formspree and replace the submit handler in `assets/js/main.js`.

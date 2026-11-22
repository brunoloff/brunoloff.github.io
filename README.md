# Homepage of Bruno Loff

Public website: https://brunoloff.github.io/
Browser editor: https://brunoloff.github.io/admin/

Everything required to serve the website and its editor is stored in this repository. GitHub Pages builds and hosts it without an additional account or subscription. The WordPress site remains independent.

## Edit in a browser

1. Open `/admin/` and choose **Sign In Using Access Token**.
2. Create a [fine-grained GitHub personal access token](https://github.com/settings/personal-access-tokens/new). Set the resource owner to **brunoloff**, choose **Only select repositories**, select **brunoloff.github.io**, and grant **Contents: Read and write** under repository permissions. Metadata read access is automatic. No workflow or pull request permission is needed for this setup.
3. Copy the token into Sveltia's sign-in dialog. Do not put it in a repository file or commit it. Each browser remembers its own token; an expired or revoked token needs replacing.
4. Choose **Main** for the homepage, publications, and seminar; **Courses** for course pages and lecture notes; **Research** for projects, groups, and problems; or **Archive** for the imported WordPress placeholder pages. Change a page’s **Collection** field to move it between these groups. Use the rich text toolbar for formatting, alignment, images, tables, and links. Expand a **Photo** or **Expandable section** block to edit its fields. HTML source mode is also available.
5. Save/publish the entry. Saving commits it to `main` and GitHub Pages automatically rebuilds the site. Publication can take a few minutes; see the repository's Actions tab for the build result.

New pages need a unique **Page address**, such as `/my-course/`. Add a link from the homepage or another page so readers can find them. Keep existing page addresses when editing to preserve links. Page deletion is disabled in the editor to prevent accidental loss.

Upload images and PDFs through the media library. They are stored in `assets/uploads` and served by GitHub Pages. Files committed to this public repository are public, including their version history.

## Source layout

- `pages/*.html`: editable page content with YAML front matter (`title`, `layout`, `permalink`). HTML bodies preserve the imported WordPress tables, math images, alignment, and nested lists and are editable visually in Sveltia.
- `_layouts/page.html`: common HTML page layout.
- `assets/css/`: theme and locally hosted Merriweather font declarations.
- `assets/uploads/`: migrated and newly uploaded media/documents, including static equation images.
- `admin/config.yml`: Sveltia's page collections, media storage, and token-only GitHub backend.
- `assets/vendor/sveltia/`: Sveltia CMS built from the [brunoloff/sveltia-cms](https://github.com/brunoloff/sveltia-cms) fork, with `VERSION.txt` naming the fork commit. Generated; don't edit by hand.
- `admin/*.js`: this site's editor customizations (Photo and expandable-section blocks, previews, visitor statistics), using Sveltia's public API.
- `cms/`, `scripts/sync-sveltia.sh`: the build step that bundles the fork into `assets/vendor/sveltia/`. Excluded from the published site.
- `docs/`: original public page content, download hashes, imported routes, and known unavailable source files. Excluded from the published site.

The theme recreates the old WordPress Syntax appearance using a dark header and a narrow serif content column. The editor preview uses the same fonts and content styles. WordPress comments and subscription forms are not part of this static site. Third-party destinations such as arXiv, institutional pages, videos, and the existing Kaleidoscope workshop retain their external links.

## GitHub Pages settings

Repository **Settings → Pages → Build and deployment**:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/ (root)**

GitHub runs its standard Jekyll build automatically after commits, including saves made using a personal access token in Sveltia. No custom workflow or external build service is needed.

## Local preview (optional)

With Ruby and Bundler installed:

```sh
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve --host 127.0.0.1
```

Open http://127.0.0.1:4000/. Local dependencies and generated output are ignored by Git.

## Editor updates

The editor is self-hosted and loads nothing from a CDN. It is built from the `brunoloff` branch of the [brunoloff/sveltia-cms](https://github.com/brunoloff/sveltia-cms) fork, which is an upstream release plus my own editor features (see `FORK.md` there).

To update it, with the fork checked out next to this repository (`../sveltia-cms`) on the branch to build:

```sh
scripts/sync-sveltia.sh
```

It builds the fork, bundles it into `assets/vendor/sveltia/`, and copies the license and config schema (`admin/sveltia-cms.schema.json`). Then validate `admin/config.yml` against the schema, check `/admin/` in a local preview, and commit the result. Needs Node and pnpm.

Website-specific editor code belongs in `admin/*.js`; general editor improvements belong in the fork.

See [migration notes](docs/MIGRATION.md) for source preservation and outstanding broken WordPress links.

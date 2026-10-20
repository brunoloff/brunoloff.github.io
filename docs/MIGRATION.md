# Migration notes

Imported the 24 public WordPress pages on 2026-10-20. The only public blog post is an empty “All posts” entry; it has no substantive text to migrate. Existing page wording, dates, and canonical page paths have been preserved, except that the homepage is served at `/`.

Page HTML is stored with YAML front matter and edited through Sveltia rich text in HTML mode. This avoids a lossy conversion of complex teaching pages into Markdown. The WordPress placeholder About page’s editor link now opens `/admin/`. Internal page links now point to GitHub Pages, uploaded files and equation images are local, and WordPress tracking, comment forms, and subscriptions have not been imported. Original public page bodies are retained in `wordpress-source.json`.

## Files already unavailable on WordPress

These source URLs returned HTTP 404 during migration. The four document links retain their original URL for review. The missing YouTube icon has been replaced by its text label while retaining the video link.

- https://brunoloff.wordpress.com/wp-content/uploads/2025/01/teste02.pdf

- https://brunoloff.wordpress.com/wp-content/uploads/2021/01/teoria-da-informacao-resultados-trabalho-12.pdf

- https://brunoloff.wordpress.com/wp-content/uploads/2020/02/youtube_icon_small.png

- https://brunoloff.wordpress.com/wp-content/uploads/2018/09/notaslogica.pdf

- https://brunoloff.wordpress.com/wp-content/uploads/2025/12/natural-proofs-barrier-against-data-structure-lower-bounds-v1.pdf

## Scope and checks

This is a public-page import, not an authenticated WordPress export: it does not include drafts, private pages, comments, subscribers, or unlinked media. External academic and video links remain external. The WordPress site has not been changed or redirected. An automatic redirect from its domain is a separate WordPress configuration task.

`migration.json` records imported routes and SHA-256 hashes of downloaded assets. The repository includes locally hosted fonts with their OFL license and Sveltia CMS with its MIT license.

## Editor self-hosting

Sveltia CMS 0.249.0 is vendored with its distribution chunks, locales, UI fonts, syntax highlighter, and media-preview dependencies. Its bundle has narrow URL substitutions to use local copies of these resources and local version metadata. Reapply these substitutions when upgrading; otherwise the upstream bundle uses CDNs. This setup does not enable external stock media, translation, maps, or image-conversion integrations. GitHub API calls and GitHub's service-status check are expected network requests.

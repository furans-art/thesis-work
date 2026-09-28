# Subdivide Mathematics by the TOLC-S syllabus

## What will change
- Keep the official full exam at seven timed sections, with Mathematics remaining one section.
- On `/simulation`, replace the single Mathematics practice card with a grouped Mathematics area containing nine selectable syllabus categories:
  1. Numbers
  2. Algebra
  3. Geometry
  4. Functions and graphs
  5. Combinatorics and probability
  6. Means and variability
  7. Understanding and representing
  8. Reasoning
  9. Modelling and problem solving
- Give every category working **Settings** and **Start** actions using the existing pages and saved settings.
- Add bilingual Italian/English labels and short syllabus descriptions.
- Add category-specific mock questions so each practice choice tests its stated topic.

## Full exam and progress behavior
- Build the Mathematics block of a full exam from all nine category question pools, but present it as one timed section and keep the indicator at seven sections.
- Save individual category sessions under their category name in progress history.
- Keep existing Mathematics history records readable and keep wrong-answer review compatible.

## Technical details
- Add a typed mathematics-category catalogue separate from the seven official exam sections.
- Expand valid simulation targets to include category IDs without treating them as extra official exam sections.
- Update question, settings, simulation, history-label, and section lookup services to resolve both official sections and mathematics categories.
- Preserve existing local settings keys and routes; no migration or data deletion is required.
- Record the official 2026 CISIA syllabus mapping as the source of truth in the project architecture notes.

## Verification
- Check the build output.
- Click through a mathematics category from the simulation list to settings, run, and results.
- Start a full exam and confirm Mathematics is one block and the total remains seven sections.

# Page snapshot

```yaml
- region "Notifications alt+T"
- main
- dialog "Add New Recipe":
  - heading "Add New Recipe" [level=2]
  - paragraph: Create a new recipe with in-stock ingredients, instructions, and nutritional information.
  - text: Recipe Name *
  - textbox "Recipe Name *": Test Protein Shake
  - text: Servings
  - spinbutton "Servings": "2"
  - text: Total Time (min)
  - spinbutton "Total Time (min)": "5"
  - text: Tags
  - button "Select tags...":
    - text: Select tags...
    - img
  - paragraph: Organize your recipes with tags like "paleo", "gluten-free", "breakfast", "main-dish", etc.
  - text: Instructions *
  - textbox "Instructions *": 1. Add ingredients to blender\n2. Blend until smooth\n3. Serve immediately
  - text: Notes
  - textbox "Notes"
  - text: Select Ingredients * (in-stock only)
  - button "Search and select in-stock ingredients...":
    - text: Search and select in-stock ingredients...
    - img
  - button "Cancel"
  - button "Add Recipe"
  - button "Close":
    - img
    - text: Close
```
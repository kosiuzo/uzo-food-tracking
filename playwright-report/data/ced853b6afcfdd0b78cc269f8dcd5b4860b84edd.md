# Page snapshot

```yaml
- region "Notifications alt+T"
- main
- dialog "Edit Recipe":
  - heading "Edit Recipe" [level=2]
  - paragraph: Update your recipe details and in-stock ingredients.
  - text: Recipe Name *
  - textbox "Recipe Name *": Updated Recipe Name
  - text: Servings
  - spinbutton "Servings": "8"
  - text: Total Time (min)
  - spinbutton "Total Time (min)": "15"
  - text: Tags
  - button "Select tags...":
    - text: Select tags...
    - img
  - paragraph: Organize your recipes with tags like "paleo", "gluten-free", "breakfast", "main-dish", etc.
  - text: Instructions *
  - textbox "Instructions *": "1. Prepare the cucumber: Peel the cucumber (optional). Cut into chunks and place in food processor. Pulse briefly until finely chopped. Transfer to fine-mesh sieve and squeeze out excess water. 2. Combine ingredients: Return drained cucumber to food processor. Add Greek yogurt, minced garlic, olive oil, lemon juice, dill, salt and black pepper. 3. Blend: Pulse until desired consistency is reached. 4. Taste and adjust: Add more lemon juice, dill, or salt as needed. 5. Chill: Transfer to serving bowl. Cover and refrigerate for at least 30 minutes."
  - text: Notes
  - textbox "Notes"
  - text: Select Ingredients * (in-stock only)
  - button "Search and select in-stock ingredients...":
    - text: Search and select in-stock ingredients...
    - img
  - button "Cancel"
  - button "Update Recipe"
  - button "Close":
    - img
    - text: Close
```
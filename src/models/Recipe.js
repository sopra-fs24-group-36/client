/**
 * Recipe model
 */
class Recipe {
    constructor(data = {}) {
      this.title = null;
      this.link = null;
      this.shortDescription = null;
      this.cookingTime = null;
      this.ingredients = null;
      this.instructions = null;
      this.tags = null;
      this.cookbooks=null;
      Object.assign(this, data);
    }
  }
  
  export default Recipe;
  
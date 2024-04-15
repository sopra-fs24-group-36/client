/**
 * Recipe model
 */
class Arecipe {
  constructor(data = {}) {
    this.id = null;
    this.title = null;
    this.shortDescription = null;
    this.token = null;
    this.link = null;
    this.cooking_time = null;
    this.ingredients = null;
    this.instructions=null;
    this.image=null;
    this.tags=null;
    this.cookbooks=null;
    Object.assign(this, data);
  }
}

export default Arecipe;

/**
 * Group model
 */
class Group {
  constructor(data = {}) {
    this.id = null; 
    this.group_name = null;
    this.group_members = null;
    this.group_recipes = null;
    this.group_image = null; 
    Object.assign(this, data);
  }
}
  
export default Group;
  
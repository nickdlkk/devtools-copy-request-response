import { makeAutoObservable } from 'mobx';

class NavigationStore {
  currentPage: string = 'home';

  constructor() {
    makeAutoObservable(this);
  }

  navigateTo(page: string) {
    this.currentPage = page;
  }
}

const navigationStore = new NavigationStore();
export default navigationStore; 
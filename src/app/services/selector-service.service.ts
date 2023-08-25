import { Injectable, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InputSelector, SelectorXPath } from 'src/interfaces/action';

const INITIAL_STATE = {
  parentSelector: [],
  inputSelector: [],
  buttonSelector: [],
}

@Injectable({
  providedIn: 'root'
})
export class SelectorService {

  private selectedElementXPaths: SelectorXPath = INITIAL_STATE;

  private selectedXPathsSubject = new BehaviorSubject<string[] | InputSelector[]>([]);
  private toggleContainer = new BehaviorSubject<boolean>(false);
  activeSelector = 'parentSelector';
  previousSelector = 'parentSelector';

  emptyAll(): void {
    this.activeSelector = 'parentSelector';
    this.selectedElementXPaths = INITIAL_STATE;
    this.selectedXPathsSubject.next([]);
    this.toggleContainer.next(false);
    this.previousSelector = 'parentSelector';
  }

  setActiveSelector(selector: string): void {
    this.previousSelector = this.activeSelector;
    this.activeSelector = selector;
  }

  getActiveXpaths(): string[] | InputSelector[] {
    return this.selectedElementXPaths[this.activeSelector];
  }

  getAllXPaths(): SelectorXPath {
    return this.selectedElementXPaths;
  }

  setContentForXpath(selector: string, content: string): void {
    const availabeElementXpaths = this.selectedElementXPaths[selector];

    availabeElementXpaths.forEach((xPath) => {
      const path = xPath as InputSelector;
      path.content = content;
    })

    this.selectedElementXPaths[selector] = [...availabeElementXpaths] as InputSelector[];
  }

  addSelectedXPath(xpath: string): void {
    const xpathElements = this.getActiveXpaths() as (string | InputSelector)[];

    if (this.activeSelector === 'inputSelector') {
      xpathElements.push({ path: xpath });
    } else {
      xpathElements.push(xpath);
    }


    this.selectedElementXPaths[this.activeSelector] = xpathElements as string[] | InputSelector[];
    this.selectedXPathsSubject.next(this.getActiveXpaths());
  }

  removeSelectedXPath(xpath: string): void {
    const activeXpaths = this.getActiveXpaths() as (string | InputSelector)[];

    const updatedXpaths = (activeXpaths).filter((x: string | InputSelector) =>
      typeof x === "string" ? x !== xpath : x.content !== xpath
    );

    this.selectedElementXPaths[this.previousSelector || this.activeSelector] = updatedXpaths as string[] | InputSelector[];

    this.selectedXPathsSubject.next(this.getActiveXpaths());
  }

  getToggleContainer(): Observable<boolean> {
    return this.toggleContainer.asObservable();
  }

  setToggleContainer(): void {
    this.toggleContainer.next(!this.toggleContainer.getValue());
  }

  getSelectedXPathsObservAble(): Observable<string[] | InputSelector[]> {
    return this.selectedXPathsSubject.asObservable();
  }

  getSelectedXPathsByInput(selector: string): string[] | InputSelector[] {
    return this.selectedElementXPaths[selector];
  }

  getSelectedXPaths(selector: string | null): string[] | InputSelector[] {
    return this.selectedElementXPaths[selector || this.activeSelector];
  }

  removeAll(): void {
    this.selectedXPathsSubject.next([]);
  }

  forceRemove(): void {
    this.selectedElementXPaths[this.activeSelector] = [];
  }
}

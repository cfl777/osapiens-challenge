import { render } from "@testing-library/react";
import Home from ".";

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: unknown) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  }
}));

describe('Home page', () => {
  it('renders without crashing', () => {
    render(<Home />);
  });
});

//Enhancements: can extend testing. 

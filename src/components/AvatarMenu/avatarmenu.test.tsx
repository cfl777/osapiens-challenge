import { render } from "@testing-library/react";
import AvatarMenu from ".";

const mockUser = {
    firstName: "Aria",
    lastName: "Test",
    eMail: "linda.bolt@osapiens.com"
}

describe('avatar menu component', () => {
  it('renders without crashing', () => {
    render(<AvatarMenu user={mockUser} />);
  });
});

//Enhancements: extend testing once AvatarMenu is worked on. 

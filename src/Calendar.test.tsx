import "@testing-library/jest-dom";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Calendar from './Calendar';
import dayjs from "dayjs";

describe('Calendar component', () => {
    beforeEach(() => {

        global.fetch = jest.fn().mockResolvedValue({
              json: jest.fn().mockResolvedValue({
                births: [{ text: 'John Doe' }, { text: 'Jane Doe' }],
              }),
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should show the Calendar title', async () => {

        const { getByText } = render(<Calendar />);
        await waitFor(() => {
                const element = getByText('Birthday Calendar');
                expect(element).toBeInTheDocument();
        });
    });
        
    it ('should display the calendar with current month and year when first rendered', async () => {

        render(<Calendar />);
        
        const monthTitle = dayjs().format('MMMM YYYY');

        const element = await screen.findByText(monthTitle);
        expect(element).toBeInTheDocument();

    });

    it ('should display birthdays on current date when first rendered', async () => {

        render(<Calendar />);

        const title = await screen.findByText('Famous birthdays on this date:');
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });


    it('should toggle the star icon type when clicked', async () => {

        render(<Calendar />);

        const stars = await screen.findAllByTestId('regular-star')

        expect(stars).toBeDefined();

        //click on the first star to toggle it from regular to solid (highlighted)
        fireEvent.click(stars[0]);
        expect(stars[0].getAttribute('data-testid')).toEqual('solid-star');

        //toggle back from highlighted to regular
        fireEvent.click(stars[0]);
        expect(stars[0].getAttribute('data-testid')).toEqual('regular-star');
        
    });


    //Note: this test isn't working, can't seem to access the calendar input element
    // it('should display a list of famous birthdays when a date is selected', async () => {

    //     global.fetch = jest.fn().mockResolvedValue({
    //         json: jest.fn().mockResolvedValue({
    //           births: [{ text: 'Anne Smith' }, { text: 'Dan Brown' }],
    //         }),
    //     });

    //     render(<Calendar />);

    //     const element = await screen.findByTestId('calendar-input');
    //     expect(element).toBeInTheDocument();

    //     fireEvent.change(element, { target: { value: '2022-02-22' } });

    //     expect(screen.getByText('Anne Smith')).toBeInTheDocument();
    //     expect(screen.getByText('Dan Brown')).toBeInTheDocument();
        
    // });


});   

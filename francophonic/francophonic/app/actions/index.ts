export const DATA_AVAILABLE = 'DATA_AVAILABLE';

//Import the sample data

export function getData(){
    return (dispatch: any) => {
 
        //Make API Call
        //For this example, I will be using the sample data in the json file
        //delay the retrieval [Sample reasons only]
        setTimeout(() => {
            const data  = {data: "whatever, this is a placeholder"};
            dispatch({type: DATA_AVAILABLE, data:data});
        }, 1);
 
    };
}
export const Loading = () => {
    return <div id="Loading"></div>
};

export const NoData = ({ message }) => {
    return <p className="no-data">{ message }</p>
};

export const InputEmpty = (obj) => {
    const IsNotEmpty = Object.values(obj).some((ele) => ele === "");
    return IsNotEmpty;
};

export const checkSelectValueIsValid = (data, event, target = null) => {
    return data.some(
      ele => {
        if (typeof event !== 'string') {
            if (Number(event.target.value)) {
                return ele[target] === parseInt(event.target.value);
            } else {
                return ele === event.target.value;
            };
        };

        return ele === event;
      }
    );
};

export const GetSchoolYear = () => {
    const date = new Date();
    if (date.getMonth() + 1 >= 9 && date.getMonth() + 1 <= 12) 
        return `${date.getFullYear()}/${date.getFullYear() + 1}`;
    else return `${date.getFullYear() - 1}/${date.getFullYear()}`;
    
};
interface AssigneeIconProps {
    classes? : string;
}


const AssigneeIcon = ( props: AssigneeIconProps ) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={props.classes} viewBox="0 0 24 30" x="0px" y="0px">
      <title>_</title>
      <path d="M19,4H14a2,2,0,0,0-4,0H5A1,1,0,0,0,4,5V19a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V5A1,1,0,0,0,19,4ZM7,19V18a2.00226,2.00226,0,0,1,2-2h6a2.00222,2.00222,0,0,1,2,2v1Zm12,0H18V18a3,3,0,0,0-3-3H9a3,3,0,0,0-3,3v1H5V5H8V6h8V5h3ZM12,8a3,3,0,1,0,3,3A3,3,0,0,0,12,8Zm0,5a2,2,0,1,1,2-2A2.0023,2.0023,0,0,1,12,13Z" />
    </svg>
  );
};
export default AssigneeIcon;

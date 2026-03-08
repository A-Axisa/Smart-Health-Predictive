

const NavBar = ({role}) => {

if (role === "standard_user")
    return(
        <h1>Hello User</h1>
    );

if (role === "merchant")
    return(
        <h1>Hello Merchant</h1>
    );

if (role === "admin")
return(
        <h1>Hello Admin</h1>
    );
}


export default NavBar;
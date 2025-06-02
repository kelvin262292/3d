import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <div>
            <header>
                <h1>My E-commerce Store</h1>
import { Link } from 'react-router-dom';
 
 // And change href to to:
<Link to="/">Home</Link>
                        <li><Link href="/products">Products</Link></li>
                        <li><Link href="/cart">Cart</Link></li>
                    </ul>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <p>&copy; 2023 My E-commerce Store</p>
            </footer>
        </div>
    );
};

export default Layout;
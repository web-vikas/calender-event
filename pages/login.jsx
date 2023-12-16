import Layout from '../components/layout';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function LoginPage({ username }) {
    const router = useRouter();
    const { msg } = router.query;

    return (
        <Layout pageTitle="Login">
            <div className='body'>
                <div className="card">
                    {msg ? <h3 className="text-danger">{msg}</h3> : <></>}
                    <Link className='register-button text-none' href="/">⬆️ Go Back to Home Page. ⬆️</Link>
                    <h2 className="mb-4">Log in</h2>
                    <form action="/api/login" method="POST">
                        <div className="mb-3">
                            <input
                                minLength="3"
                                name="username"
                                id="username"
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                minLength="5"
                                name="password"
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">
                            Login
                        </button>
                        <Link className='register-button text-none' href="/signup">
                            New Here?
                        </Link>
                    </form>
                </div>
            </div>

        </Layout>
    );
}

export async function getServerSideProps(context) {
    const req = context.req;
    const res = context.res;
    var username = getCookie('username', { req, res });
    if (username != undefined) {
        return {
            redirect: {
                permanent: false,
                destination: '/',
            },
        };
    }
    return { props: { username: false } };
}

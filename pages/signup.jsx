import Layout from '../components/layout'
import { getCookie } from 'cookies-next';
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function SignupPage({ username }) {
    const router = useRouter()
    const { msg } = router.query
    return (
        <Layout pageTitle="Signup">
            {msg ?
                <h3 className="red">{msg}</h3>
                :
                <></>
            }
            <div className='body'>

                <div className='card'>

                    <h2>Sign up</h2>
                    <form action='/api/signup' method='POST'>
                        <input minLength="3" name="username" id="username" type="text" placeholder='Username' required></input>
                        <input minLength="5" name="password" id="password" type="password" placeholder='Password' required></input>
                        <input minLength="5" name="passwordagain" id="passwordagain" type="password" placeholder='Password Again' required></input>
                        <button type="submit" className="login-button" style={{ marginTop: 10 }}>
                            Sign Up
                        </button>
                        <Link className='register-button text-none' href="/login">
                            Already have an account ?
                        </Link>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const req = context.req
    const res = context.res
    var username = getCookie('username', { req, res });
    if (username != undefined) {
        return {
            redirect: {
                permanent: false,
                destination: "/"
            }
        }
    }
    return { props: { username: false } };
};
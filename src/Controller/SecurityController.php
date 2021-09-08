<?php


namespace App\Controller;

use App\Util\CheckRedirections;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends AbstractController
{
    private $requestStack;
    private $userSession;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
        $this->userSession = $this->requestStack->getSession();
        $this->userSession->start();
    }

    /**
     * @Route("/login", name="login")
     */
    public function login(AuthenticationUtils $authenticationUtils, CheckRedirections $cr): Response
    {
        //checks for logged in user
        if ($cr->checkLoginUser() == 1)
            return $this->redirectToRoute('cms_management');
        if ($cr->checkLoginUser() == 2)
            return $this->redirectToRoute('cms_management_admin');

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
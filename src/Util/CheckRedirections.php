<?php


namespace App\Util;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RequestStack;

class CheckRedirections extends AbstractController
{
    private $requestStack;
    private $userSession;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
        $this->userSession = $this->requestStack->getSession();
        $this->userSession->start();
    }

    public function checkCMSUser()
    {
        if ($this->userSession->get('roles') == 'user' || $this->userSession->get('roles') == 'admin') {
            return true;
        }
        return false;
    }

    public function checkCMSAdmin()
    {
        if ($this->userSession->get('roles') == 'admin') {
            return true;
        }
        return false;
    }

    public function checkLoginUser()
    {
        if ($this->userSession->get('roles') == 'user') {
            return 1;
        }
        if ($this->userSession->get('roles') == 'admin') {
            return 2;
        }
        return false;
    }


}
<?php
namespace App\Controller;

use App\Util\CheckRedirections;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Annotation\Route;

class AdminManagementController extends AbstractController
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
     * @Route("/admin", name="cms_management_admin")
     */
    public function index(CheckRedirections $cr)
    {
        //check for logged in user
//        if (!$cr->checkCMSAdmin()) return $this->redirectToRoute('login'); TODO:peut etre finir
        return $this->redirectToRoute('pages_management');

        return $this->render('cms/cms.html.twig', [
            'username' => 'test'
        ]);

    }
}

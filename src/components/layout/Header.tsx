import React from "react"
import { Link } from "react-router-dom"
import { Menu, Home, PlusCircle, User, Settings } from "lucide-react"
import { Button } from "../ui/button"

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 items-center justify-center mx-auto">
        <div className="w-full max-w-5xl flex justify-between items-center">
          <div className="flex">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                PetCare
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="flex flex-col items-center text-sm font-medium transition-colors text-gray-600 hover:text-blue-600"
              >
                <div className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <span className="mt-1">Home</span>
              </Link>
              <Link
                to="/add-pet"
                className="flex flex-col items-center text-sm font-medium transition-colors text-gray-600 hover:text-green-600"
              >
                <div className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors">
                  <PlusCircle className="h-5 w-5 text-green-600" />
                </div>
                <span className="mt-1">Add Pet</span>
              </Link>
              <Link
                to="/profile"
                className="flex flex-col items-center text-sm font-medium transition-colors text-gray-600 hover:text-purple-600"
              >
                <div className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <span className="mt-1">Profile</span>
              </Link>
              <Link
                to="/settings"
                className="flex flex-col items-center text-sm font-medium transition-colors text-gray-600 hover:text-orange-600"
              >
                <div className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors">
                  <Settings className="h-5 w-5 text-orange-600" />
                </div>
                <span className="mt-1">Settings</span>
              </Link>
            </nav>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden bg-gray-100 hover:bg-gray-200 rounded-full"
              onClick={toggleMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="container flex justify-center md:hidden">
          <div className="w-full max-w-5xl">
            <nav className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow-lg mt-2 border">
              <Link
                to="/"
                className="flex items-center space-x-3 text-sm font-medium transition-colors text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="p-2 rounded-full bg-blue-100">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <span>Home</span>
              </Link>
              <Link
                to="/add-pet"
                className="flex items-center space-x-3 text-sm font-medium transition-colors text-gray-600 hover:text-green-600 p-2 rounded-lg hover:bg-green-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="p-2 rounded-full bg-green-100">
                  <PlusCircle className="h-5 w-5 text-green-600" />
                </div>
                <span>Add Pet</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center space-x-3 text-sm font-medium transition-colors text-gray-600 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="p-2 rounded-full bg-purple-100">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <span>Profile</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center space-x-3 text-sm font-medium transition-colors text-gray-600 hover:text-orange-600 p-2 rounded-lg hover:bg-orange-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="p-2 rounded-full bg-orange-100">
                  <Settings className="h-5 w-5 text-orange-600" />
                </div>
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

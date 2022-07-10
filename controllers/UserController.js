const User = require('../models/User')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const createUserToken = require('../helpers/create-users-tokens')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController{
    static async create(req, res) {
        const {name, surname, email, phone, gender, address, description, birth, cep, city, uf, password, confirm_pass} = req.body

        if(!name) {
            res.status(400).json({message: 'Informe o nome!'})
            return
        }
        if(!surname) {
            res.status(400).json({message: 'Informe o sobrenome!'})
            return
        }
        if(!email) {
            res.status(400).json({message: 'Informe o e-mail!'})
            return
        }
        if(!phone) {
            res.status(400).json({message: 'Informe o nomtelefonee!'})
            return
        }
        if(!birth) {
            res.status(400).json({message: 'Informe o nascimento!'})
            return
        }
        if(!gender) {
            res.status(400).json({message: 'Informe o gênero!'})
            return
        }
        if(!description) {
            res.status(400).json({message: 'Informe uma descrição sobre você!'})
            return
        }
        if(!address) {
            res.status(400).json({message: 'Informe o enderço!'})
            return
        }
        if(!cep) {
            res.status(400).json({message: 'Informe o CEP!'})
            return
        }
        if(!city) {
            res.status(400).json({message: 'Informe a cidade!'})
            return
        }
        if(!uf) {
            res.status(400).json({message: 'Informe o UF!'})
            return
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória!' })
            return
        }
        if (!confirm_pass) {
            res.status(422).json({ message: 'Confirme a senha por favor!' })
            return
        }

        if (password !== confirm_pass) {
            res.status(422).json({ message: 'As senhas são diferentes. Tente novamente!' })
        }

        const userExists = await User.findOne({email: email})
        
        if(userExists){
            res.status(422).json({message: 'O e-mail já está cadastrado!'})
            return
        }

        const salt = await bcrypt.genSalt(12)
        const passHash = await bcrypt.hash(password, salt)

        const user = new User({
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            birth: birth,
            description: description,
            gender: gender,
            address: address,
            cep: cep,
            city: city,
            uf: uf,
            password: passHash
        })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({message: error})
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        if (!email) {
            res.status(422).json({ message: 'Informe o E-mail!' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'Informe a senha!' })
            return
        }
        
        const user = await User.findOne({ email: email })

        if (!user) {
            res.status(422).json({ message: 'E-mail incorreto!' })
            return
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({ message: 'Senha inválida!' })
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {
        let currentUser

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'secret')

            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined
        } else {
            currentUser = null
        }
        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findById(id).select('-password')

        if(!user) {
            res.status(422).json({message: 'Usuário não encontrado!'})
            return
        }

        res.status(200).json({user})

    }

    static async update(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const {name, surname, email, phone, gender, address, description, birth, cep, city, uf, password, confirm_pass} = req.body
        
        if(req.file){
            user.image = req.file.filename
        }

        if(!name) {
            res.status(400).json({message: 'Informe o nome!'})
            return
        }
        user.name = name
        if(!surname) {
            res.status(400).json({message: 'Informe o sobrenome!'})
            return
        }
        user.surname = surname
        const userExists = await User.findOne({ email: email })

        if (user.email !== email && userExists) {
            res.status(422).json({ message: 'Este e-mail já está em uso!' })
            return
        }

        user.email = email
        if(!phone) {
            res.status(400).json({message: 'Informe o nomtelefonee!'})
            return
        }
        user.phone = phone
        if(!birth) {
            res.status(400).json({message: 'Informe o nascimento!'})
            return
        }
        user.birth = birth
        if(!gender) {
            res.status(400).json({message: 'Informe o gênero!'})
            return
        }
        user.gender = gender
        if(!description) {
            res.status(400).json({message: 'Informe uma descrição sobre você!'})
            return
        }
        user.description = description
        if(!address) {
            res.status(400).json({message: 'Informe o enderço!'})
            return
        }
        user.address = address
        if(!cep) {
            res.status(400).json({message: 'Informe o CEP!'})
            return
        }
        user.cep = cep
        if(!city) {
            res.status(400).json({message: 'Informe a cidade!'})
            return
        }
        user.city = city
        if(!uf) {
            res.status(400).json({message: 'Informe o UF!'})
            return
        }
        user.uf = uf
        
        if (password !== confirm_pass) {
            res.status(422).json({ message: 'As senhas não são iguais!' })
            return
        } else if (password === confirm_pass && password != null) {
            const salt = await bcrypt.genSalt(12)
            const passHash = await bcrypt.hash(password, salt)

            user.password = passHash
        }

        try {
            await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            )

            res.status(200).json({message: 'Usuário atualizado!'})
        } catch (err) {
            res.status(500).json({ message: err })
            return
        }
    }


}
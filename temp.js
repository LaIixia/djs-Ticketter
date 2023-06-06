//チケットボタンを表示
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    /*if (!interaction.member.permissions.has("ADMINISTRATOR"))
     return interaction.reply({
       content: "このコマンドを使うには以下の権限が必要です。\n```管理者権限```",
       ephemeral: true,
     });*/
    if (interaction.commandName === "ticket") {
        const cre = new Discord.MessageButton()
            .setCustomId("create")
            .setStyle("PRIMARY")
            .setLabel("チケットを作成する");
        const embed1 = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setDescription("チケットを作成するには下のボタンを押してください");
        await interaction.reply({
            embeds: [embed1],
            components: [new Discord.MessageActionRow().addComponents(cre)],
        });
    }
});
//チケットを作成
client.on("interactionCreate", async (interaction) => {
    if (interaction.customId === "create") {
        await interaction.reply({
            content: "作成しました",
            ephemeral: true,
        });
        const del = new Discord.MessageButton()
            .setCustomId("delete")
            .setStyle("DANGER")
            .setLabel("削除");
        const name = "チケット" + `${interaction.user.id}`;
        //let mid = Math.floor(Math.random() * 1000);
        await interaction.guild.channels
            .create(`${name}`, {
                reason: `Created By : ${interaction.user.username}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ["VIEW_CHANNEL"],
                    },
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    },
                    {
                        id: client.user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
                    },
                ],
            })
            .catch(async (error) => {
                await interaction.reply({
                    content:
                        "このコマンドを使うにはボットに以下の権限が必要です。\n```チャンネルの管理```",
                    ephemeral: true,
                });
            });
        const embed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setDescription(
                "チケットを作成しました。削除する場合は下のボタンを押してください"
        );
        //探す
        const channel = await interaction.guild.channels.cache.find((ch) => ch.name === `${name}`)
        //チャンネル名同じ=> return
        if (channel == name ) return await interaction.reply({
            content:"作成済です。",
            ephemeral: true,
        });
        //探して送る
        channel.send({
            embeds: [embed],
            components: [new Discord.MessageActionRow().addComponents(del)],
        });
    }
    //チケットを削除
    if (interaction.customId === "delete") {
        const cid = interaction.channel.id;
        await interaction.guild.channels.delete(`${cid}`).catch(async (error) => {
            await interaction.reply({
                content:
                    "このコマンドを使うにはボットに以下の権限が必要です。\n```チャンネルの管理```",
                ephemeral: true,
            });
        });
    }
});
